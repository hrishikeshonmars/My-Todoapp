from django.shortcuts import render,get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from.models import Todo
from.serializers import TodoSerializer


@api_view(['GET', 'POST'])
def todo_list(request):
    if request.method == 'GET':
        todos = Todo.objects.all()
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    

    @api_view(['GET','PATCH', 'PUT', 'DELETE'])
    def todo_detail(request):
        todo = get_object_or_404(Todo, id=pk)

        if request.method == 'GET':
            serializer = TodoSerializer(todo)
            return Response(serializer.data)

        elif request.method == 'PUT':
          serializer = TodoSerializer(todo, data=request.data)
          if serializer.is_valid():
             serializer.save()
             return Response(serializer.data)
          
          elif request.method == 'DELETE':
              todo.delete()
              return Response(status=HTTP_204_NO_CONTENT)